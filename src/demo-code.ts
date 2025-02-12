export const startingCode = `count = 1000

loop ii <- count times
    pushMatrix()

   i = 1-(((ii + time()  * 100) % count) / count)

        hsl((time()/4/4)%1,0.7,0.2*fft(0))

        translate(
            cos(ii)*2,sin(ii)*2,
           i * 200 - 20
        )

scale((fft(0)*fft(6)+0.1)*(1-fft(7)))

        box()
    popMatrix()
endloop


fx_feedback()

fx_grid(1.3)
fx_ascii(fft(4)*20 + 10)
fx_feedback()

fx_warp(1, 0.1, 0.001)

fx_feedback()

fx_kale(6)

fx_rgb(0.002)


fx_bloom()
`;
