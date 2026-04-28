# Brand Diagnostic, archived

Status. Paused mid build during phase one V2 launch. Scheduled to resume in coming weeks as part of phase two advanced features.

Components.
DiagnosticTrigger.tsx, scrolling ticker CTA.
SliderDiagnostic.tsx, full screen modal with three sliders that recommends a service.
diag-styles.css, the extracted CSS rules, originally lines 5572 to 5792 in src/app/globals.css.

How to revive.
1. git mv archive/brand-diagnostic/DiagnosticTrigger.tsx src/components/DiagnosticTrigger.tsx
2. git mv archive/brand-diagnostic/SliderDiagnostic.tsx src/components/SliderDiagnostic.tsx
3. Paste the contents of archive/brand-diagnostic/diag-styles.css back into src/app/globals.css.
4. Re add the import and the rendered DiagnosticTrigger JSX in src/components/services/ServicesClient.tsx.
5. Test on Vercel preview before merging to main.

Owner. Maninder Singh.
