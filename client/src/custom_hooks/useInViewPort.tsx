import React, {useState, useEffect} from 'react'

function useInViewPort() {
    const [inView, setInView] = useState(false);
    const [elem, setElem] = useState<Element>()
    const isInViewport = (element:Element) => {
        if(!element)return
        const rect = element.getBoundingClientRect();        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight+element.clientHeight-120 || document.documentElement.clientHeight+element.clientHeight-120) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    
    const scrollListener = () => {
        let isInView
        if (elem){
            isInView = isInViewport(elem)
            if(isInView) setInView(isInView)
        }
    }

    useEffect(() => {
        if (elem)window.addEventListener('scroll', scrollListener)
        return () => window.removeEventListener('scroll', scrollListener)
    })

    useEffect(() => {
        scrollListener()
    }, [elem])

    useEffect(() => {
        if(!elem)return
        if (inView === true){
            elem.classList.add('fade-in');
            elem.classList.remove('fade-out');
        }
        else if (elem){
            elem.classList.add('fade-out');
            elem.classList.remove('fade-in')
        }
    }, [inView])


    return (elemen:any) => {
        const element = elemen.current
        setElem(element)
        return inView
    }
}

export default useInViewPort