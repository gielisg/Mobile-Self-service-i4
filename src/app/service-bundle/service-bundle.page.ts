import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/service/loading.service';
import { TranslateServiceService } from 'src/service/translate-service.service';

@Component({
  selector: 'app-service-bundle',
  templateUrl: './service-bundle.page.html',
  styleUrls: ['./service-bundle.page.scss'],
})
export class ServiceBundlePage implements OnInit {

  // Pie
  public pieChartLabels: string[] = ['Non/Usage', 'Calls', 'Data', 'SMS/MMS'];
  public pieChartData: number[] = [500, 190, 300, 120];
  public pieChartType: string = 'pie';

  public pieChartOptions: any = {
    animate: true,
    offset: 25,
    sliceOffset: 0,
    labelOffset: 3,
    type: 'stacked',
    hoveredColor: '#9fd4ff',
    showLabels: true,
    resizeLabels: false,
    updateHeights: false,
  };

  constructor(
    public navCtrl: NavController,
    public translate: TranslateServiceService,
  ) { }

  ngOnInit() {
    this.ionicInit();

  }

  goback() {
    this.navCtrl.pop();
  }

  ionicInit() {
    this.translate.translaterService();
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
