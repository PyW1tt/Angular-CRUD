import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { User } from 'src/app/model/user.model';
import { Location } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  imagePreview!: string | ArrayBuffer
  file!: File
  mUser: User = new User()
  
  task!: AngularFireUploadTask
  downloadURL!: Observable<string>

  // name = new FormControl('', Validators.required);
  // address = new FormControl('', Validators.required);
  // email = new FormControl('', [Validators.required, Validators.email]);
  // phone = new FormControl('', [Validators.required, Validators.minLength(10)]);

  constructor(private location: Location,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage) {

  }

  ngOnInit(): void {

  }

  async onPreviewImage(event: any) {
    const metaImage = event.target.files[0]
    const path = `/user/${metaImage.name}`
    const ref = this.storage.ref(path)

    this.task = this.storage.upload(path, metaImage)
    if (metaImage) {
      this.file = metaImage

      const reader = new FileReader()
      reader.readAsDataURL(metaImage)
      reader.onload = () => {
        this.imagePreview = reader.result as string
      }
      
      await this.task;
      console.log('Image uploaded!');
      this.mUser.image = await ref.getDownloadURL().toPromise();
      this.mUser.imageName = path
    }
    
  }

  onSubmit() {
    console.log(JSON.stringify(this.mUser))
    let itemRef = this.db.list('user')
    itemRef.push(this.mUser).then(() =>
      this.location.back()
    )

    window.alert('Create success')
  }

  onCancel() {
    this.location.back()
  }



}
