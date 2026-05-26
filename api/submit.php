<?php
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true);

// Honeypot check — bots fill this in, real users never see it
if (!empty($input['website'])) {
    echo json_encode(['success' => true]);
    exit;
}

$name           = htmlspecialchars(trim($input['name'] ?? ''));
$organisation   = htmlspecialchars(trim($input['organisation'] ?? ''));
$email          = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone          = htmlspecialchars(trim($input['phone'] ?? ''));
$areaOfInterest = htmlspecialchars(trim($input['area_of_interest'] ?? ''));
$message        = htmlspecialchars(trim($input['message'] ?? ''));

if (!$name || !$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name and email are required.']);
    exit;
}

function resend(string $apiKey, array $payload): int {
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ],
    ]);
    curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $status;
}

// --- Notification to the business ---
$notificationHtml = "
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<style>
  body { margin:0; padding:0; background:#f4f4f4; font-family: Arial, sans-serif; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:6px; overflow:hidden; }
  .header { background:#0a0a0a; padding:24px 32px; }
  .header span { color:#fff; font-size:18px; font-weight:bold; letter-spacing:0.5px; }
  .body { padding:32px; }
  h2 { margin:0 0 24px; font-size:20px; color:#111; }
  .field { margin-bottom:18px; }
  .label { font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.6px; }
  .value { font-size:15px; color:#111; margin-top:4px; }
  .msg-box { background:#f7f7f7; border-left:3px solid #0a0a0a; padding:14px 16px; margin-top:4px; border-radius:2px; font-size:15px; color:#333; white-space:pre-wrap; }
  .footer { padding:16px 32px; border-top:1px solid #eee; font-size:12px; color:#aaa; }
</style>
</head>
<body>
<div class='wrap'>
  <div class='header'><span>Mase Consulting Group</span></div>
  <div class='body'>
    <h2>New Enquiry Received</h2>
    <div class='field'><div class='label'>Name</div><div class='value'>{$name}</div></div>
    <div class='field'><div class='label'>Organisation</div><div class='value'>" . ($organisation ?: '—') . "</div></div>
    <div class='field'><div class='label'>Email</div><div class='value'><a href='mailto:{$email}'>{$email}</a></div></div>
    <div class='field'><div class='label'>Phone</div><div class='value'>" . ($phone ?: '—') . "</div></div>
    <div class='field'><div class='label'>Area of Interest</div><div class='value'>" . ($areaOfInterest ?: '—') . "</div></div>
    <div class='field'><div class='label'>Message</div><div class='msg-box'>" . ($message ?: '—') . "</div></div>
  </div>
  <div class='footer'>Sent via the contact form at maseconsultinggroup.com</div>
</div>
</body>
</html>
";

$notifyStatus = resend(RESEND_API_KEY, [
    'from'     => 'Mase Consulting Group Website <info@maseconsultinggroup.com>',
    'to'       => ['info@maseconsultinggroup.com'],
    'reply_to' => [$email],
    'subject'  => "New Enquiry from {$name} — Mase Consulting Group",
    'html'     => $notificationHtml,
]);

// --- Auto-reply to the submitter ---
$autoReplyHtml = "
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<style>
  body { margin:0; padding:0; background:#f4f4f4; font-family: Arial, sans-serif; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:6px; overflow:hidden; }
  .header { background:#0a0a0a; padding:24px 32px; }
  .header span { color:#fff; font-size:18px; font-weight:bold; letter-spacing:0.5px; }
  .body { padding:32px; color:#333; font-size:15px; line-height:1.7; }
  .body p { margin:0 0 16px; }
  .footer { padding:16px 32px; border-top:1px solid #eee; font-size:12px; color:#aaa; }
</style>
</head>
<body>
<div class='wrap'>
  <div class='header'><span>Mase Consulting Group</span></div>
  <div class='body'>
    <p>Dear {$name},</p>
    <p>Thank you for reaching out to Mase Consulting Group.</p>
    <p>We have received your enquiry and a member of our team will be in touch with you shortly.</p>
    <p>We look forward to the conversation.</p>
    <p>Best regards,<br><strong>The Mase Consulting Group Team</strong></p>
  </div>
  <div class='footer'>Mase Consulting Group &mdash; maseconsultinggroup.com</div>
</div>
</body>
</html>
";

resend(RESEND_API_KEY, [
    'from'    => 'Mase Consulting Group <info@maseconsultinggroup.com>',
    'to'      => [$email],
    'subject' => 'Thank you for your enquiry — Mase Consulting Group',
    'html'    => $autoReplyHtml,
]);

if ($notifyStatus >= 200 && $notifyStatus < 300) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send. Please email us directly at info@maseconsultinggroup.com']);
}
