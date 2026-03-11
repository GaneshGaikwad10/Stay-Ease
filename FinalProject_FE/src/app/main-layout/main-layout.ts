import { Component } from '@angular/core';

import { Navbar } from '../layout/navbar/navbar';
import { Footer } from '../layout/footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar,Footer,RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {

}
