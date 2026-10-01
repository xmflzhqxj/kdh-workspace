import os
import subprocess
from pathlib import Path
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
import whisper
import imageio_ffmpeg

def get_video_info(url):
    ydl_opts = {'quiet': True, 'no_warnings': True, 'skip_download': True, 'noplaylist': True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        # The Windows batch console commonly uses CP949, which cannot print
        # some YouTube title characters (for example, `‼`). Remove only
        # characters unsupported by that console so processing can continue.
        title = info['title'].encode('cp949', errors='ignore').decode('cp949')
        return title, info['id']

def setup_ffmpeg():
    """Return the FFmpeg binary bundled with imageio-ffmpeg."""
    return imageio_ffmpeg.get_ffmpeg_exe()


def download_audio(url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True,
        'noplaylist': True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return ydl.prepare_filename(info)

def get_transcript_from_youtube(video_id):
    try:
        transcript_list = YouTubeTranscriptApi().list(video_id)
        
        # 한국어(ko) 또는 영어(en) 자막을 우선적으로 찾습니다.
        try:
            transcript = transcript_list.find_transcript(['ko', 'en'])
        except NoTranscriptFound:
            # 지정한 언어가 없다면 자동 생성 자막이나 사용 가능한 아무 자막을 가져옵니다.
            transcript = next(iter(transcript_list), None)
            if transcript is None:
                return None
            
        transcript_data = transcript.fetch()
        text = "\n".join(
            item.text if hasattr(item, 'text') else item['text']
            for item in transcript_data
        )
        return text
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        return None
    except Exception as e:
        print(f"자막을 가져오는 중 오류가 발생했습니다: {e}")
        return None

def transcribe_with_whisper(audio_file):
    ffmpeg_exe = setup_ffmpeg()

    def run_with_bundled_ffmpeg(command, *args, **kwargs):
        if command and command[0] == 'ffmpeg':
            command = [ffmpeg_exe, *command[1:]]
        return subprocess.run(command, *args, **kwargs)

    # Whisper expects a system-wide `ffmpeg` command. Use the executable
    # installed inside this project's virtual environment instead.
    whisper.audio.run = run_with_bundled_ffmpeg
    print("Whisper 모델을 로드하는 중입니다 (첫 실행 시 모델 다운로드로 인해 시간이 걸릴 수 있습니다)...")
    # 무료로 로컬에서 돌릴 수 있는 OpenAI의 Whisper base 모델 사용
    model = whisper.load_model("base") 
    print("음성 인식(STT)을 시작합니다. 영상 길이에 따라 다소 시간이 소요될 수 있습니다...")
    result = model.transcribe(audio_file)
    return result['text']

def main():
    temp_audio = None
    setup_ffmpeg()
    print("=============================================")
    print("       유튜브 영상 대사 추출 프로그램        ")
    print("=============================================")
    url = input("유튜브 링크를 입력하세요: ").strip()
    if not url:
        print("링크가 입력되지 않았습니다.")
        return

    try:
        print("\n[1/3] 영상 정보를 가져오는 중...")
        title, video_id = get_video_info(url)
        # 파일명에 사용할 수 없는 특수문자 제거
        safe_title = "".join([c for c in title if c.isalpha() or c.isdigit() or c in ' -_가-힣']).strip()
        output_filename = f"{safe_title}-STT.txt"
        output_path = Path(__file__).resolve().parent / output_filename
        
        print(f"영상 제목: {title}")
        print("\n[2/3] 유튜브 자체 자막 존재 여부를 확인합니다...")
        
        transcript = get_transcript_from_youtube(video_id)
        
        if transcript:
            print("=> 성공적으로 유튜브 자체 자막을 가져왔습니다.")
        else:
            print("=> 자막이 존재하지 않습니다. AI STT(음성 인식)를 통해 대사를 추출합니다.")
            temp_audio = f"temp_audio_{video_id}.%(ext)s"
            print("=> 음성을 다운로드하는 중...")
            temp_audio = download_audio(url, temp_audio)
            
            try:
                transcript = transcribe_with_whisper(temp_audio)
            finally:
                # Do not retain downloaded audio after an STT attempt.
                if temp_audio and os.path.exists(temp_audio):
                    os.remove(temp_audio)
            
            # 임시 오디오 파일 삭제
            if os.path.exists(temp_audio):
                os.remove(temp_audio)
                
            print("=> 음성 인식이 완료되었습니다.")

        print(f"\n[3/3] 추출된 대사를 파일로 저장합니다...")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(transcript)
            
        print(f"\n완료! 대사가 현재 폴더의 '{output_filename}'에 저장되었습니다.")
        
    except Exception as e:
        print(f"\n프로그램 실행 중 오류가 발생했습니다: {e}")
        
    input("\n프로그램을 종료하려면 엔터를 누르세요...")

if __name__ == "__main__":
    main()
