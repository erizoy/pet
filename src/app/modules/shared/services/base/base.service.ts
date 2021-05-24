import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog/dialog-ref';
import { InfoModalComponent } from '../../components/info-modal/info-modal.component';
import { Observable, throwError } from 'rxjs';

export class BaseService {
  errorModal?: MatDialogRef<InfoModalComponent>; // Reference to opened error modal

  constructor(
    protected dialog: MatDialog
  ) {}

  /**
   * Handler opens modal with error code when rtdb reference throws error
   * @param error - object from failed rtdb reference
   * @param caught - server response
   * @return Observable of caught
   */
  public errorHandler<T>(error: any, caught: Observable<T>): Observable<never> {
    if (!this.errorModal) {
      this.errorModal = this.dialog.open(InfoModalComponent, {
        width: '340px',
        data: { error }
      });
    }

    this.errorModal.afterClosed().subscribe(_ => {
      this.errorModal = undefined;
    });

    return throwError(error);
  }
}
