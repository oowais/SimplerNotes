import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Observable, BehaviorSubject } from 'rxjs';

import { Note } from '../model/note';
import { FeedbackViewModel } from '../model/feedback';


@Injectable({
    providedIn: 'root'
})
export class SharedService {

    // private BASE_URL: string = 'http://127.0.0.1:5002/';
    private BASE_URL = 'http://localhost:8000/';

    private FEEDBACK_URL: string = this.BASE_URL + 'feedback';
    private GET_NOTES_URL: string = this.BASE_URL + 'notes';
    private ADD_NOTE_URL: string = this.BASE_URL + 'notes/add';
    private EDIT_NOTE_URL: string = this.BASE_URL + 'notes/edit';
    private DELETE_BY_ID_URL: string = this.BASE_URL + 'notes/delete';

    private searchValue = new BehaviorSubject<string>('');
    private page = new BehaviorSubject<string>('');
    private deleteNote = new BehaviorSubject<number>(0);

    currentSearchValue = this.searchValue.asObservable();
    currentPage = this.page.asObservable();
    currentDeleteNote = this.deleteNote.asObservable();

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) { }

    /**
     * @ngdoc function
     * @name changePage
     * @description Send event that page has changed
     * @param pageName
     */
    changePage(pageName: string) {
        this.page.next(pageName);
    }

    /**
     * @ngdoc function
     * @name changeSearchValue
     * @description Send event that search value has changed
     * @param search
     */
    changeSearchValue(search: string) {
        this.searchValue.next(search);
    }

    /**
     * @ngdoc function
     * @name triggerDeleteNote
     * @description Send event that delete must be executed
     * @param search
     */
    triggerDeleteNote(id: number) {
        this.deleteNote.next(id);
    }


    /**
     * @ngdoc function
     * @name getAllNotes
     * @description Get call to get all notes from server
     * @returns Observable<Note[]>
     */
    getAllNotes(): Observable<any> {
        return this.http.get<Note[]>(this.GET_NOTES_URL);
    }


    /**
     * @ngdoc function
     * @name getFilteredNotes
     * @description Get call to get filtered notes from server
     * @returns Observable<Note[]>
     */
    getFilteredNotes(searchVal): Observable<Note[]> {
        return this.http.get<Note[]>(this.GET_NOTES_URL + '?search=' + searchVal);
    }

    /**
     * @ngdoc function
     * @name submitFeedback
     * @description Post call to submit feedback to server
     * @param feedback
     * @returns Observable<any>
     */
    submitFeedback(feedback: FeedbackViewModel): Observable<any> {
        return this.http.post(this.FEEDBACK_URL, feedback);
    }

    /**
     * @ngdoc function
     * @name alert
     * @description Snack bar alert message
     * @param text Text to be displayed on alert snack bar
     * @param error If this alert is an error message or info
     */
    alert(text: string, error: boolean): void {
        let config = new MatSnackBarConfig();
        config.verticalPosition = 'top';
        config.horizontalPosition = 'center';
        config.duration = 2000;
        config.panelClass = error ? ['error-toast'] : undefined;
        this.snackBar.open(text, 'Close', config);
    }

    deleteById(id: number): Observable<any> {
        return this.http.post(this.DELETE_BY_ID_URL, { 'id': id });
    }

    addNote(heading: string, text: string): Observable<any> {
        return this.http.post(this.ADD_NOTE_URL, { 'heading': heading, 'text': text });
    }

    editNote(id: number, heading: string, text: string): Observable<any> {
        return this.http.post(this.EDIT_NOTE_URL, { 'id': id, 'heading': heading, 'text': text });
    }
}
