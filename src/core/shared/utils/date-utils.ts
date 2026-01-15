import moment from "moment";

export function returnDateDiff(
    past: string | undefined,
    now: string | undefined
): number | undefined {
    if (past === undefined || now === undefined) {
        return 0;
    }

    let time_one = moment(past);
    let time_two = moment(now);
    let duration = moment.duration(time_two.diff(time_one));
    return parseInt(duration.asDays().toFixed());
}
