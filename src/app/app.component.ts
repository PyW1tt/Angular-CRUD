import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{

  mobileMax:MediaQueryList 

  private _mobileListener: () => void

  constructor(changeDeRef:ChangeDetectorRef,media:MediaMatcher){
    this._mobileListener = () => changeDeRef.detectChanges()
    this.mobileMax = media.matchMedia('(max-width: 600px)')
    this.mobileMax.addListener(this._mobileListener)
  }

  ngOnDestroy(): void {
    this.mobileMax.removeListener(this._mobileListener)
  }
  
}
