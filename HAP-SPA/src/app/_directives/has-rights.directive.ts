import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import {RoleAccess } from '../models/User';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRight]'
})
export class HasRightsDirective implements OnInit{
  @Input() appHasRight: RoleAccess;
  isVisible = false;
    constructor(
      private viewContaninerRef: ViewContainerRef,
      private templateRef: TemplateRef<any>,
      private authService: AuthService
    ) { }
    ngOnInit(): void {
      const userRights = this.authService.currentUser.roleAccess;
      if (!userRights){
        this.viewContaninerRef.clear();
      }
      if (this.authService.rightsMatch(this.appHasRight)){
        if (!this.isVisible){
          this.isVisible = true;
          this.viewContaninerRef.createEmbeddedView(this.templateRef);
        }else{
          this.isVisible = false;
          this.viewContaninerRef.clear();
        }
      }
    }
  
  }
  