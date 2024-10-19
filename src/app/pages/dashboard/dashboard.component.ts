import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SidebarComponent } from '../../common/sidebar/sidebar.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { Chart, LinearScale, BarController, BarElement, Title, CategoryScale } from 'chart.js';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('totalRevenueChart') totalRevenueChart!: ElementRef;
  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    const qty = document.getElementById('queriesthisChart') as HTMLCanvasElement;

    Chart.register(LinearScale, BarController, BarElement, Title, CategoryScale);

    new Chart(qty, {
      type: 'bar',
      data: {
        labels: ['Jan','Feb','Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Revenue',
          data: [360,480,685,784,415,984,1250,1350,1410,1180,10,10],
          backgroundColor: '#17a2b8',
          borderColor: '#17a2b8',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
    
    const qbs = document.getElementById('queriesbystatusChart') as HTMLCanvasElement;

    Chart.register(LinearScale, BarController, BarElement, Title, CategoryScale);

    new Chart(qbs, {
      type: 'bar',
      data: {
        labels: ['New', 'Active', 'No Connect', 'Hot Lead', 'Confirmed', 'Canceled', 'Invalid', 'Proposal Sent', 'Follow Up'],
        datasets: [{
          label: 'Revenue',
          data: [23.7,9.5,2.3,0.4,2.5,41.1,1.1,9.9,9.6],
          backgroundColor: '#17a2b8',
          borderColor: '#17a2b8',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
