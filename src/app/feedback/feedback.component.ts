import { Component, OnInit } from '@angular/core';
import { FeedbackViewModel } from '../model/feedback';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  model: FeedbackViewModel = {
    name: '',
    email: '',
    feedback: ''
  };

  url: string = 'http://127.0.0.1:5002/';

  constructor(
    private service: SharedService,
  ) { }

  ngOnInit() {
    this.service.changePage(location.pathname);
  }

  /**
   * @ngdoc function
   * @name submitFeedback
   * @description sends post call to server with feedback data
   */
  submitFeedback(): void {
    if (!this.validation())
      return;

    this.service.submitFeedback(this.model).subscribe(
      res => {
        if (true == res.success) {
          alert("Feedback submitted");
          location.reload();
        }
        else
          this.service.alert("Unexplainable error occured!", true);
      },
      err => {
        this.service.alert("Server error!", true);
      }
    );
  }

  /**
   * @ngdoc function
   * @name validation
   * @description Validates if content in feedback is proper or not
   * @returns boolean
   */
  validation(): boolean {
    if (this.model.email.trim() == '') {
      this.service.alert("Please enter email address", true);
      return false;
    } else if (!this.emailVerify(this.model.email)) {
      this.service.alert("Please enter a valid email address", true);
      return false;
    }
    if (this.model.feedback.trim().length < 20) {
      this.service.alert("Feedback is too small, (try with 20 characters)", true);
      return false;
    }
    return true;
  }

  /**
   * @ngdoc function
   * @name emailVerify
   * @description Verifies email against regex
   * @param email
   * @returns boolean
   */
  emailVerify(email: string): boolean {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let emailRes = regexp.exec(email);
    if (emailRes == null)
      return false;
    else if (emailRes.length > 0)
      return true;
  }

}
