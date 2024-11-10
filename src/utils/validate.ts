export class Validate {
  static email(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  static Password = (val: string) => {
    return val.length >= 6;
  };
  
  static EventValidation = (data: any) => {
    console.log(data);
    const mess: string[] = [];
    Object.keys(data).forEach(key => {
      if (key !== 'description' && key !== 'users' && key !== 'locationAddress') {
        !data[`${key}`] && mess.push(`${key} là bắt buộc!`);
      }
    });
    
    return mess;
  };

}
