import TWEEN, { Tween } from '@tweenjs/tween.js';
import { ref } from 'vue'

export  function useAnimate<T extends Record<string, number>> (
	startObj: T, 
	endObj: T, 
	onUpdate: {
		(obj: T): void
	},
	onComplete?: {
		(): void
	},) {
	let isOpening = ref(false);
	let isCloseing = ref(false);
	let isPauseing = ref(false);
  const instanceTween = (startObj: T, endObj: T) => 
  new TWEEN.Tween(startObj)
    .to(endObj, 3000)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(onUpdate)
    .onComplete(() => {
			onComplete && onComplete()
      isOpening.value = false;
      isCloseing.value = false;
      isPauseing.value = false;
    });

	let openInstanceTween: Tween<any> = instanceTween({ ...startObj }, { ...endObj });
  let closeInstanceTween: Tween<any> = instanceTween({ ...endObj }, { ...startObj });
	const pause = () => {
		if (isOpening.value && !isPauseing.value) {
			isPauseing.value = true;
			openInstanceTween.pause();
			return 
		}
		if (isCloseing.value && !isPauseing.value) {
			isPauseing.value = true;
			closeInstanceTween.pause();
			return 
		}
	
		if (isOpening.value && isPauseing.value) {
			isPauseing.value = false;
			openInstanceTween.resume();
			return 
		}
	
		if (isCloseing.value && isPauseing.value) {
			isPauseing.value = false;
			closeInstanceTween.resume();
			return 
		}
	}
	return {
		open: () => {
			if (!isCloseing.value) {
        isOpening.value = true;
        console.log('glass open')
        openInstanceTween.start();
      } 
		},
		close: () => {
			closeInstanceTween.start();
		},
		pause
	}
}