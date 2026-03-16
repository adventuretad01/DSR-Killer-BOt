const express = require('express');
const app = express();
app.use(express.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Webhook verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Receive messages
app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const event = entry.messaging[0];
      const senderId = event.sender.id;
      if (event.message) {
        const text = event.message.text.toLowerCase();
        let reply = '';
        if (text.includes('สนใจ') || text.includes('ราคา')) {
          reply = 'สวัสดีครับ! 🎣 ยินดีต้อนรับสู่ Adventuretad อุปกรณ์ตกปลา\nสนใจสินค้าประเภทไหนครับ?\n1. คันตกปลา\n2. รอก\n3. เหยื่อ\n4. อุปกรณ์เสริม';
        } else if (text.includes('1') || text.includes('คัน')) {
          reply = '🎣 คันตกปลาของเรามีหลายรุ่นครับ\nราคาเริ่มต้น 500-5,000 บาท\nสนใจรุ่นไหนเป็นพิเศษมั้ยครับ?';
        } else if (text.includes('2') || text.includes('รอก')) {
          reply = '⚙️ รอกของเรามีทั้งรอกสปินนิ่งและรอกเบทครับ\nราคาเริ่มต้น 800-8,000 บาท\nต้องการดูรายละเอียดเพิ่มเติมมั้ยครับ?';
        } else if (text.includes('3') || text.includes('เหยื่อ')) {
          reply = '🐛 เหยื่อตกปลามีหลายประเภทครับ ทั้งเหยื่อปลอมและเหยื่อจริง\nราคาเริ่มต้น 50-500 บาท\nสนใจประเภทไหนครับ?';
        } else if (text.includes('สั่ง') || text.includes('ซื้อ')) {
          reply = '✅ ดีเลยครับ! กรุณาแจ้งข้อมูลดังนี้ครับ\n1. ชื่อ-นามสกุล\n2. ที่อยู่จัดส่ง\n3. เบอร์โทรศัพท์';
        } else {
          reply = 'สวัสดีครับ! 🎣 Adventuretad อุปกรณ์ตกปลา\nพิมพ์ "สนใจ" หรือ "ราคา" เพื่อดูสินค้าได้เลยครับ';
        }
        sendMessage(senderId, reply);
      }
    });
    res.sendStatus(200);
  }
});

function sendMessage(recipientId, text) {
  const fetch = require('node-fetch');
  fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text }
    })
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot running on port ${PORT}`));
