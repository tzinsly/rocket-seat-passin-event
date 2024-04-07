export function generateSlugFromTitle(title: string) {
    return title
        .normalize('NFD') // normalize diacritics
        .replace(/[\u0300-\u036f]/g, '') // remove diacritical marks
        .toLowerCase() // convert to lower case
        .replace(/[^a-z0-9]+/g, '-') // replace spaces and non-alphanumeric characters with a dash
        .replace(/^-|-$/g, ''); // remove leading and trailing dashes
}