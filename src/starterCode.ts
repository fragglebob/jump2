export const starterCode = `loop ii <- 200 times
pushMatrix()
    hsl((time()/4+ii/13.37)%1,1.2,2)
    translate(
        sin(time()/4+ii/40)*2.5 + cos(time()+ii), 
        cos(time()/4+ii/40)*6+ sin(time()+ii), 
        cos(time()/10+ii/7)*6  + sin(time()+ii)
    )
    rotateX(time()+ii)
    rotateZ(time()+ii)   
    rotateY(time()-ii) 
    scale(fft(7)*fft(3)*8+0.1)
    box()
popMatrix()
endloop

fx_feedback()
fx_warp(4,0.4, 0.9)

hsl((time()/4)%1,1.1,2)
loop ii <- 10 times
pushMatrix()
    scale(fft(ii+6)*8+1)
    rotateY(ii+(3+fft(12)*0.5))
    rotateX(ii/2)
    rotateZ(ii+(2+fft(6)*5))
    box()
popMatrix()
endloop`