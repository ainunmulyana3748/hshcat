export function generateWhatsAppUrl(phoneNumber: string, message: string): string {
  // Clean phone number from non-numeric characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
