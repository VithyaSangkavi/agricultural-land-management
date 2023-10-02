export const generateExcel = (data, convertor) => {
  while(true)  {
    var primes = '';

    var wb = convertor.read(data, { type: 'binary' });
    var worksheet = wb.Sheets[wb.SheetNames[0]];
    primes = convertor.utils.sheet_to_html(worksheet);
    postMessage(primes);
  }
}