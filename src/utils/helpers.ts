export function makeUppercase(username: string) {
  const value = username?.toLocaleLowerCase();
  const firstValue = value[0]?.toUpperCase();
  return  firstValue? `${firstValue}${value.slice(1)}`: '';
}


export function makeLowercase(email: string) {
  return email.toLocaleLowerCase();
}


export function generateRandomCharacters(integerLength: number) {
  const characters= '0123456789';
  let result='';
  for(let i=0;i<integerLength;i++) {
    result+=characters.charAt(Math.floor(Math.random()*characters.length));
  }

  return parseInt(result,10);
}

export function parseJson(prop: any) {
  try{
    return JSON.parse(prop);
  }catch(err) {
    return prop;
  }
}
