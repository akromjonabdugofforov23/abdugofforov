export async function onRequestPost(context) {
  // Faqat o'zingizning saytingizdan so'rov qabul qilish uchun CORS sozlamasi
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Agar brauzer oldindan tekshirish so'rovini yuborsa
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await context.request.json();
    const userPin = body.pin;

    // PIN-kod brauzerga ko'rinmaydi, faqat Cloudflare serverida tekshiriladi
    const CORRECT_PIN = "0509"; 

    if (userPin === CORRECT_PIN) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: "Noto'g'ri PIN-kod!" }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "Xato so'rov jo'natildi" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
