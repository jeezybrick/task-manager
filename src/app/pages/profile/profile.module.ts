import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [EditProfileComponent],
   imports: [
    CommonModule,
    FormsModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
