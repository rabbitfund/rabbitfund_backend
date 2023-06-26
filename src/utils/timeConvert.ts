export const dateOfUtc8 = () => {
  const now = Date.now();
  const utc8Offset = 8 * 60 * 60 * 1000; // UTC+8 的時間偏移量，以毫秒為單位
  const utc8Time = now + utc8Offset; // 調整時間偏移量
  const convertedDate = new Date(utc8Time);
  console.log('convertedDate', convertedDate);
  return convertedDate

}