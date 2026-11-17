# V12 · Quyết định triển khai audio

Chọn hai đường triển khai ngay: **thu âm do người dùng chủ động** trong Audio Workbench và **giọng trình duyệt cho học có hướng dẫn**. Không biến giọng trình duyệt hoặc waveform QA thành audio đề thi. Provider offline/paid vẫn giữ tắt đến khi có đầu vào phù hợp; không hỏi lại reviewer trong vòng này.

Máy: 12th Gen Intel(R) Core(TM) i5-12500H, 16 GiB RAM. GPU khoảng 4 GiB theo bằng chứng V11, chưa benchmark inference. Python hiện 3.14.0; torch/qwen_tts/melo chưa cài. Không suy khả năng chạy từ tên model 0.6B.

## Tài nguyên và khả năng chạy

| Provider | Chất lượng thực đo | Runtime / phần cứng | Dung lượng | Chi phí / offline | Rủi ro |
| --- | --- | --- | --- | --- | --- |
| Qwen3-TTS 0.6B CustomVoice | NOT_MEASURED_LOCAL | Isolated Python 3.12 recommended upstream; qwen-tts, torch/torchaudio, transformers 4.57.3, accelerate 1.12.0, soundfile, sox, onnxruntime; Upstream CUDA/bfloat16 example; FlashAttention optional recommendation. 4GiB VRAM fit and CPU latency NOT_ESTABLISHED on this machine | HF repository display approximately 2.5 GB total including speech_tokenizer; main model.safetensors approximately 1.81 GB. Tokenizer standalone approximately 682 MB; do not double-count when embedded. Runtime/dependency downloads additional, unmeasured | Local compute/storage; no paid provider call; After complete installation/download | Multi-GB downloads and Python/CUDA/flash-attn compatibility; Python 3.14 currently installed, no torch/qwen_tts |
| MeloTTS Chinese | NOT_MEASURED_LOCAL | torch, torchaudio, transformers 4.27.4, librosa 0.9.1, pypinyin 0.50.0 and multilingual text dependencies; isolated environment required; CPU support claimed by publisher; local RAM/time NOT_MEASURED | Chinese checkpoint approximately 208 MB from HF file list; language/BERT/runtime extra downloads not included and total NOT_ESTABLISHED | Local resources; After all runtime and language assets installed | Old pinned dependencies versus Python 3.14; checkpoint deserialization and additional downloads |
| Piper Huayan already on disk | HSK2 pronunciation NOT_REVIEWED | Existing standalone engine/ONNX; Python onnxruntime import not installed in current interpreter; CPU local; new HSK2 inference NOT_MEASURED | Existing ONNX 63,201,294 bytes; runtime ZIP 22,477,236 bytes; no new download | Local resources; true | Rights evidence remains insufficient for selected outputs |
| Azure standard neural | NOT_TESTED_NO_REQUEST | Existing HTTPS provider adapter; server-only key/region/voice and explicit paidConsent; Provider inference; no local GPU requirement | No local model; output WAV transfer varies by transcript | Metered; actual account price/budget NOT_CONFIGURED; false | Billing, network availability, contract and key handling |
| Browser SpeechSynthesis guided learning | Control flow tested with speech double; actual device pronunciation NOT_MEASURED | Browser with installed Mandarin voice; getVoices/voiceschanged; Device/voice dependent; some voices may use network | No application model download; OS voice package size device dependent | Device/provider dependent; application makes no paid API request; Only when installed voice supports offline playback | Missing voices, language mismatch or remote service |
| User-initiated microphone recording | Technical flow tested with fake capture; no real human speech obtained | Secure-context browser MediaRecorder/AudioContext/IndexedDB; server PCM QA; User-selected microphone; no GPU/model | No model; output mono PCM16 24kHz capped 90sec | User time and local storage; Record/save draft locally; upload requires local API | Permission denial, noise, wrong transcript, local draft storage, missing pronunciation review |

## Quyền và quyết định

| Provider | License / quyền output | Thử local | Dùng riêng | Publish | Đầu vào thiếu | Hành động |
| --- | --- | --- | --- | --- | --- | --- |
| Qwen3-TTS 0.6B CustomVoice | Apache-2.0 model/card/code; separate voice/output scope pending project rights decision; NOT_VERIFIED_FOR_PROJECT_ASSETS | CONDITIONAL_INSTALL_AND_SCOPE_APPROVAL_REQUIRED | NOT_CLEARED | false | Download/install consent, isolated compatible runtime, documented voice/output usage scope | Use microphone route now; if selected later, approve resource budget and setup Python 3.12 venv before 3–5 transcript PoC |
| MeloTTS Chinese | MIT card/library; checkpoint uses pickle-based torch.load; voice/output scope pending; NOT_VERIFIED_FOR_PROJECT_ASSETS | CONDITIONAL_INSTALL_AND_SCOPE_APPROVAL_REQUIRED | NOT_CLEARED | false | Compatible isolated environment, dependency/download budget and output scope | CPU candidate for a later approved small PoC; do not install into the application runtime |
| Piper Huayan already on disk | Voice/training evidence remains UNKNOWN from V10/V11; NOT_VERIFIED | Runtime present; not selected to create new learning audio | NOT_CLEARED | false | Voice/output license evidence and pronunciation review | Keep old assets private/blocked; obtain documentary scope or replace through immutable revision |
| Azure standard neural | Account-specific Azure agreement and applicable product terms; ACCOUNT_CONTRACT_NOT_PROVIDED | Adapter tests only; live generation disabled | NOT_CLEARED | false | Authorized resource/terms/key/budget consent | Configure only after project owner authorizes account and cost; 3–5 outputs then PCM and review |
| Browser SpeechSynthesis guided learning | Device/provider terms apply; no recording or redistribution implemented; Direct playback only; not stored as AudioAsset | Yes for selection/fallback behavior | GUIDED_DIRECT_PLAYBACK_ONLY | false | Actual device voice listening validation | Vocabulary/examples/guided transcripts only; clear missing-Mandarin fallback, never enable mock gate |
| User-initiated microphone recording | Real recorder rights declaration and authorized scope attestation required; Separate private/commercial/redistribution claims; not automatic approvals | IMPLEMENTED_AND_QA_TESTED | ONLY_AFTER_REAL_RECORDER_CONSENT_AND_AUTHORIZED_RIGHTS_REVIEW | false | Real volunteered recording and actual authorized decisions | Use Audio Workbench, start with 5 prepared transcripts then 25 candidate jobs |

Dung lượng HF là số làm tròn trên file list được kiểm tra ngày 18/10/2026, không phải tổng kích thước cài đặt. Qwen repository khoảng 2,5 GB đã gồm thư mục tokenizer; không cộng tokenizer hai lần. Melo checkpoint khoảng 208 MB chưa gồm runtime/tài nguyên ngôn ngữ. Không tải bất kỳ model mới nào.

## Bằng chứng mới so với V11

- **Qwen3-TTS 0.6B CustomVoice**: [Nguồn 1](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-0.6B-CustomVoice/tree/main), [Nguồn 2](https://huggingface.co/Qwen/Qwen3-TTS-Tokenizer-12Hz/tree/main), [Nguồn 3](https://raw.githubusercontent.com/QwenLM/Qwen3-TTS/main/pyproject.toml), [Nguồn 4](https://github.com/QwenLM/Qwen3-TTS#installation)
- **MeloTTS Chinese**: [Nguồn 1](https://huggingface.co/myshell-ai/MeloTTS-Chinese/tree/main), [Nguồn 2](https://raw.githubusercontent.com/myshell-ai/MeloTTS/main/requirements.txt), [Nguồn 3](https://raw.githubusercontent.com/myshell-ai/MeloTTS/main/melo/download_utils.py)
- **Piper Huayan already on disk**: [Nguồn 1](https://huggingface.co/rhasspy/piper-voices/blob/main/zh/zh_CN/huayan/medium/MODEL_CARD)
- **Azure standard neural**: [Nguồn 1](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/text-to-speech), [Nguồn 2](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/OVOVS)
- **Browser SpeechSynthesis guided learning**: [Nguồn 1](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices)
- **User-initiated microphone recording**: `local:src/components/admin/MicrophoneRecorder.tsx`, `local:src/services/microphoneDraft.ts`

[audio-decision](../../data/reports/v12/audio-decision.json) · [Hướng dẫn thao tác](AUDIO_POC_RESULT.md).

Nội dung tự biên soạn giữ **AI_GENERATED / NEEDS_REVIEW / PREVIEW**. Kiểm tra tự động không thay duyệt ngôn ngữ, cấp HSK, phát âm hoặc quyền sử dụng. Human Reviewed và Published của ngân hàng hiện hành đều bằng 0.
