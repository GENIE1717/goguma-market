// 신고 사유 — DB(goguma_reports.reason)의 check 제약과 같아야 한다
export const REPORT_REASONS = ["사기 의심", "욕설·비매너", "약속 불이행", "허위 매물", "기타"] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];
