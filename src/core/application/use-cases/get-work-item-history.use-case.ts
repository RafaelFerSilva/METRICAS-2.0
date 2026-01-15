import { IWorkItemRepository } from '../../domain/repositories/work-item-repository.interface';
import { StateTimeDTO } from '../dtos/state-time.dto';
import { WorkItemUpdate } from '../../domain/entities/work-item-update.entity';
import { returnDateDiff } from '../../shared/utils/date-utils';

export class GetWorkItemHistoryUseCase {
    constructor(private workItemRepo: IWorkItemRepository) { }

    async execute(workItemId: string, title?: string): Promise<StateTimeDTO> {
        const updates = await this.workItemRepo.getWorkItemUpdates(workItemId, title);

        return this.calculateTime(updates);
    }

    private calculateTime(items: WorkItemUpdate[]): StateTimeDTO {
        let ind = 0;
        let stateElement: string[] = [];
        let timeElement: number[] = [];

        while (ind < items.length) {
            let state: string | undefined;
            let time: number | undefined;

            if (items[ind + 1] !== undefined) {
                state = items[ind].state;
                time = returnDateDiff(
                    items[ind].stateChangeDate,
                    items[ind + 1].stateChangeDate
                );
            } else {
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, "0");
                let mm = String(today.getMonth() + 1).padStart(2, "0");
                let yyyy = today.getFullYear();

                state = items[ind].state;
                time = returnDateDiff(
                    items[ind].stateChangeDate,
                    `${yyyy}-${mm}-${dd}`
                );
            }
            ind += 1;

            if (state !== undefined && time !== undefined) {
                stateElement.push(state);
                timeElement.push(time);
            }
        }

        let removeClosedTime = Array.from(timeElement);

        // Remove time for "Closed" state from Lead Time calculation??
        // Logic from original:
        // if (element === "Closed") { removeClosedTime.splice(index, 1) }
        // BUT slice removes by index. If multiple "Closed"? 
        // Original logic:
        stateElement.forEach((element, index) => {
            if (element === "Closed") {
                // Warning: splicing logic in loop alters indices? 
                // Original used splice(index, 1). 
                // If I modify array while iterating, indices shift? 
                // Original: 
                // stateElement.forEach... removeClosedTime.splice(index, 1)
                // Wait, removeClosedTime is a copy. stateElement is separate.
                // If I remove index 3, then index 5 becomes index 4.
                // If I remove index 5 later, I'm removing the wrong item?
                // Yes, splicing inside forEach loop over DIFFERENT array using INDEX is dangerous if multiple removals efficiently.
                // But let's assume original logic was correct or "Legacy".
                // Actually, if we remove element at index `i`, subsequent elements shift.
                // If we later try to remove element at index `j` (where j > i), we remove `j`th element of NEW array (which was `j+1`th of old?).
                // I should verify if I want to "FIX" this bug or preserve legacy behavior.
                // "Refactoring" usually implies preserving behavior unless bug is obvious fixes.
                // This looks like a bug.
                // Correct way: Map or Filter.

                // Let's assume intent: Exclude "Closed" durations from Lead Time sum.
                // So: `leadTime = timeElement.filter((_, i) => stateElement[i] !== "Closed").reduce(...)`
                // This handles index shifts implicitly (by not shifting, just filtering).
            }
        });

        // I will implement "Fix" approach as it's cleaner.
        const leadTime = timeElement.reduce((acc, curr, index) => {
            if (stateElement[index] === "Closed") return acc;
            return acc + curr;
        }, 0);

        stateElement.push("Lead Time");
        timeElement.push(leadTime);

        return { stateElement, timeElement };
    }
}
