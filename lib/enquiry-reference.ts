/** A stable customer reference; the original ID remains available to existing clients. */
export function enquiryReference(id: string) { return `MMS-${id}`; }
