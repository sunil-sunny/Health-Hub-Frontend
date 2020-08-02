/* @author Sai Sunil Menta <ss734478@dal.ca> */

import { Component, OnInit } from '@angular/core';
import { SuggestDoctorModel } from 'src/app/model/suggestDoctorModel';
import { SuggestDoctorService } from 'src/app/services/suggestdoctor/suggestdoctor.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'healthhub-suggestdoctor',
    templateUrl: './suggestdoctor.component.html',
    styleUrls: ['./suggestdoctor.component.css']
})

export class SuggestdoctorComponent implements OnInit {

    suggestQuery: SuggestDoctorModel = new SuggestDoctorModel();

    symptoms: string[];
    selectedSymptoms;
    doctorList: any[];
    count: number;

    cities: any[] = [
        { value: 'Ontario' },
        { value: 'Toronto' },
        { value: 'Halifax' },
        { value: 'Montreal' },
        { value: 'Vancouver'}
    ];

    constructor(private suggestDoctorService: SuggestDoctorService, private dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) {
        if (!localStorage.getItem('token') || localStorage.getItem('token') === null ||
            localStorage.getItem('token') === undefined) {
            this.dialog.closeAll();
            this.dialog.open(LoginComponent, { disableClose: true });
        }
    }

    ngOnInit() {

        this.suggestDoctorService.getSymtomList().subscribe((data) => {
            this.symptoms = data;
        });

        this.count = -1;

        this.selectedSymptoms = new Set();
    }

    name;
    id;
    viewDoctor(doctor) {
        this.snackBar.open(doctor.name, '', {
            duration: 3000,
        });
        this.name = doctor.name;
        this.id = doctor._id;
        this.router.navigateByUrl('/doctor', { state: { doctorObject: doctor } });
    }

    priceRange(value: number) {
        return value;
    }

    suggestDoctor() {

        this.suggestDoctorService.getSuggestedDoctor(this.suggestQuery).subscribe((doctorlist) => {
            this.doctorList = doctorlist;
            this.count = doctorlist.length;
            console.log('length ' + this.count);
            console.log(this.doctorList);
        }
        );

    }

    checkAndUncheckSymptoms(event: any, value: string) {

        if (event.checked) {
            if (!this.suggestQuery.symptoms.has(value)) {
                this.suggestQuery.symptoms.add(value);
            }
        } else {

            if (this.suggestQuery.symptoms.has(value)) {
                this.suggestQuery.symptoms.delete(value);
            }
        }

    }

}
