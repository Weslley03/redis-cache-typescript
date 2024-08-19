export const getAllProducts = async () => {
    const time = Math.random() * 5000;
    return new Promise((resolve)=> {
      setTimeout(()=> {
        resolve(['weslley', 'west', 'leay'])
      }, time);
    });
};
