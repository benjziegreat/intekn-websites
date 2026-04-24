import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    { faIcon: 'fa-solid fa-truck-fast', title: 'Fast Delivery', desc: 'Nationwide delivery within 2-5 business days. Same-day delivery available in Metro Manila.', features: ['Same-day Metro Manila', 'Nationwide 2-5 days', 'Real-time tracking', 'Free over ₱1,000'] },
    { faIcon: 'fa-solid fa-credit-card', title: 'Flexible Payments', desc: 'Multiple payment options including e-wallets and bank transfers for your convenience.', features: ['GCash & Maya', 'Bank transfers', 'Debit card', 'Cash on Delivery'] },
    { faIcon: 'fa-solid fa-rotate-left', title: 'Easy Returns', desc: 'Not satisfied? Return within 30 days for a full refund, no questions asked.', features: ['30-day returns', 'Free return shipping', 'Full refund', 'Easy process'] },
    { faIcon: 'fa-solid fa-shield-halved', title: 'Buyer Protection', desc: 'Every purchase is protected. Shop with confidence knowing your money is safe.', features: ['Secure checkout', 'Encrypted data', 'Fraud protection', '24/7 monitoring'] },
    { faIcon: 'fa-solid fa-headset', title: '24/7 Support', desc: 'Our customer support team is available round the clock to help you with any issues.', features: ['Live chat', 'Email support', 'Phone support', 'FAQ center'] },
    { faIcon: 'fa-solid fa-gift', title: 'Loyalty Rewards', desc: 'Earn points with every purchase and redeem them for discounts and exclusive perks.', features: ['Earn on every order', 'Birthday bonuses', 'VIP tiers', 'Exclusive deals'] }
  ];
}
