export const genAPIKey = (): string => {
    //create a base-36 string that contains 30 chars in a-z,0-9
    return [...Array(30)]
        .map(() => ((Math.random() * 36) | 0).toString(36))
        .join('');
};
