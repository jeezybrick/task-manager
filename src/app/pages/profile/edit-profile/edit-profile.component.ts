import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  public user: User;
  public profileForm: FormGroup;
  public isUserLoading = true;
  public isFormSubmitting = false;


  constructor(private authService: AuthService,
               private fb: FormBuilder) {

  }

  ngOnInit() {
    this.authService.me().subscribe((data: any) => {
      this.user = data.user;

      this.setProfileForm();
      this.isUserLoading = false;
    });

  }

  onSubmit({ value, valid }: any) {
    this.isFormSubmitting = true;

    this.authService.updateProfile(value).subscribe((response: any) => {
      this.isFormSubmitting = false;
    });
  }

  private setProfileForm(): void {
    this.profileForm = this.fb.group({
      fullname: [this.user.fullname , [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: [this.user.email , [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

}
