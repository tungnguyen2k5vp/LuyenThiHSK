# V8 · Accessibility

2026-10-16T15:49:11.035Z · Local/private preview. Không deploy, không publish.

PARTIAL. V7 audit helper được chạy lại trên V8 UI qua full Chrome/Edge flows: AX tree, tên control, contrast opaque samples, keyboard/focus/dialog Escape,200% root text scale, forced colors/reduced motion. Đây không phải screen-reader session hay browser zoom thật.

Matching dùng native select, short answer textarea/IME không bị global arrows chiếm, dialog trap/return focus giữ nguyên. Responsive đã kiểm6 widths. Không chứng nhận WCAG PASS; NVDA/JAWS/VoiceOver, real mobile, Firefox/WebKit NOT VERIFIED. Nguồn phương pháp: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html và https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/. Raw accessibility-chrome/edge reports được lưu cùng handoff.

Chrome visible-controls sample=98; Edge tương tự. Chưa kiểm toàn bộ trạng thái assistive technology. Không coi DOM audit hay số test lớn là chứng nhận accessibility.
