<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const CONTACT_TO = 'hello@vittesh.com';
const CONTACT_FROM = 'hello@vittesh.com';
const RATE_LIMIT = 8;
const RATE_WINDOW = 3600;

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Use POST.']);
  exit;
}

$raw = file_get_contents('php://input');
$data = is_string($raw) ? json_decode($raw, true) : null;
if (!is_array($data)) {
  $data = $_POST;
}

if (trim((string) ($data['company_website'] ?? '')) !== '') {
  echo json_encode(['success' => true]);
  exit;
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

$name = str_replace(["\r", "\n", "\0"], ' ', $name);
$email = str_replace(["\r", "\n", "\0"], ' ', $email);

if ($name === '' || $email === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Name, email, and message are required.']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Enter a valid email address.']);
  exit;
}

if (strlen($name) > 120) {
  $name = substr($name, 0, 120);
}
if (strlen($email) > 254) {
  $email = substr($email, 0, 254);
}
if (strlen($message) > 5000) {
  $message = substr($message, 0, 5000);
}

$ip = client_ip();
if (!allow_send($ip)) {
  http_response_code(429);
  echo json_encode(['success' => false, 'message' => 'Too many messages. Email ' . CONTACT_TO . ' instead.']);
  exit;
}

$subject = 'Portfolio message from ' . $name;
$encoded_subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$body = "Name: {$name}\nEmail: {$email}\nIP: {$ip}\n\n{$message}\n";
$headers = implode("\r\n", [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: Vittesh.com <' . CONTACT_FROM . '>',
  'Reply-To: ' . $email,
  'X-Mailer: vittesh.com contact form'
]);

$sent = @mail(CONTACT_TO, $encoded_subject, $body, $headers, '-f' . CONTACT_FROM);
if (!$sent) {
  $sent = @mail(CONTACT_TO, $encoded_subject, $body, $headers);
}

if (!$sent) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Could not send. Email ' . CONTACT_TO . ' instead.']);
  exit;
}

echo json_encode(['success' => true]);

function client_ip(): string
{
  if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    return trim((string) $_SERVER['HTTP_CF_CONNECTING_IP']);
  }
  if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $parts = explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR']);
    return trim($parts[0]);
  }
  return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function allow_send(string $ip): bool
{
  $file = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'vittesh-contact-rate.json';
  $now = time();
  $data = [];
  if (is_readable($file)) {
    $parsed = json_decode((string) file_get_contents($file), true);
    if (is_array($parsed)) {
      $data = $parsed;
    }
  }
  $hits = array_values(array_filter(
    is_array($data[$ip] ?? null) ? $data[$ip] : [],
    static fn ($stamp) => is_numeric($stamp) && ($now - (int) $stamp) < RATE_WINDOW
  ));
  if (count($hits) >= RATE_LIMIT) {
    return false;
  }
  $hits[] = $now;
  $data[$ip] = $hits;
  @file_put_contents($file, json_encode($data), LOCK_EX);
  return true;
}
