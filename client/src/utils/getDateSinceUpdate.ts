export const getTDateSinceUpdate = (updatedAtString: string):{date:number,month:string,year:number}=> {
    const updatedAt = new Date(updatedAtString);
    const updatedAtDate = updatedAt.getDate();
    const updatedAtMonth = updatedAt.getMonth() + 1; 
    const updatedAtYear = updatedAt.getFullYear();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return{
        date:updatedAtDate,
        month:months[updatedAtMonth-1],
        year:updatedAtYear
    };
};
