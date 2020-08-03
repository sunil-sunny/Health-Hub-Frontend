/* @author Avinash Gazula <agazula@dal.ca> */
/* @author Sai Sunil Menta <ss734478@dal.ca> */

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from 'src/app/services/notifications/notification.service';
import { AuthService } from './../../services/auth/auth.service';
import { LoginService } from './../../services/login/login.service';
import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { LoginComponent } from './../login/login.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    collapsed: Boolean = true;
    isLoggedIn: Boolean = false;
    notifications: any[];
    count: number;
    isDoctor: boolean;

    constructor(
        private dialog: MatDialog,
        private loginService: LoginService,
        private snackBar: MatSnackBar,
        private notificationService: NotificationService,
        private authService: AuthService
    ) {
        dialog.afterAllClosed.subscribe(() => {
            this.ngOnInit();
        })
    }

    ngOnInit(): void {
        if (localStorage.getItem('token') !== null) {
            this.isLoggedIn = true;
        }

        this.notificationService.getNotifications().subscribe((data) => {
            this.notifications = data;
            this.count = data.length;
        });

        this.isDoctor = this.authService.isDoctor();
    }

    openLoginPage = () => {
        this.dialog.open(LoginComponent);
    }

    openEditProfilePage = () => {
        this.dialog.open(EditProfileComponent);
    }

    logout = () => {
        const token = localStorage.getItem('token');
        this.loginService.logout(token).subscribe(
            data => {
                if (data.success) {
                    localStorage.clear();
                    this.isLoggedIn = false;
                    this.snackBar.open('Succesfully logged out', '', {
                        duration: 3000,
                    });
                } else {
                    this.snackBar.open('Error logging out. Please try again later', '', {
                        duration: 3000,
                    });
                }
            }
        )
    }

    markAsRead(id) {
        console.log(id);
        this.notificationService.markAsRead(id).subscribe((data) => {
            console.log('Notification marked as read ' + data);
        });

        this.notificationService.getNotifications().subscribe((data) => {
            this.notifications = data;
            this.count = data.length;
        });
    }

}
