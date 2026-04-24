import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  team = [
    { name: 'Maria Santos', role: 'CEO & Founder', avatar: '👩‍💼' },
    { name: 'Juan dela Cruz', role: 'CTO', avatar: '👨‍💻' },
    { name: 'Ana Reyes', role: 'Head of Operations', avatar: '👩‍🔧' },
    { name: 'Pedro Garcia', role: 'Lead Designer', avatar: '👨‍🎨' }
  ];

  milestones = [
    { year: '2020', text: 'InteKN Store was founded with a vision to make quality products accessible to all.' },
    { year: '2021', text: 'Reached 10,000 customers and expanded our product catalog to 5,000+ items.' },
    { year: '2022', text: 'Introduced e-wallet and bank payment solutions for seamless transactions.' },
    { year: '2023', text: 'Won Best E-Commerce Platform Award and expanded to nationwide delivery.' },
    { year: '2024', text: 'Surpassed 50,000 happy customers and launched our mobile experience.' }
  ];
}
