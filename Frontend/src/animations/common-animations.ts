import { animate, style, transition, trigger } from "@angular/animations";

export const valueChangeAnim = trigger('valueChangeAnim', [
    transition('* <=> *', [
        animate('0.07s ease-out', style({ "border-color": "limegreen" })),
        animate('0.07s ease-in', style({ "border-color": "var(--bs-border-color)" }))
    ]),
]);