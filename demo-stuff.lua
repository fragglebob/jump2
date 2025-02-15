-- this isn't actully lua, just like it

--
-- cube
--

rgb(1, 1, 1)
scale(3)
box()

--
-- rotating box
--

rgb(1, 1, 1)
rotateX(time())
rotateY(sin(time()))
scale(3)
box()

--
-- ring of boxes
--

rotateX(time() / 2)
rotateZ(sin(time() / 3))
rotateY(cos(time() / 4))

c = 32

loop i <- c times
  push()
  rotateX(2 * pi * i / c)
  translate(0, 3, 0)
  hsl(time()/5%1, 1, 0.6)
  scale(3, 0.1, 0.4)
  box()
  pop()
endloop

--
-- planet
--

rotateY(pi/2)
rotateZ(pi/3+sin(time()/7)/4)
rotateX(time() / 4)

a = 32

loop i <- a times
  push()
  rotateX(2 * pi * i / a)
  translate(0, 3, 0)
  hsl(0.05, 1, 0.3)
  scale(0.1, 1, 0.7)
  box()
  pop()
endloop

push()
hsl(0.5, 1, 0.3)
scale(2)
ball()
pop()

fx_bloom()

--
-- planet control
--

rotateY(pi/2)
rotateZ(pi/3+sin(time()/7)/5)
rotateX(time() / 4)

a = 64

b = time()/8%1

loop i <- a times
  push()
  rotateX(2 * pi * i / (a / (b*4+1)))
  translate(i/a*b*6 - b*2.5, 3, 0)
  hsl(0.05, 1, 0.3)
  scale(0.1, 1, 0.7)
  box()
  pop()
endloop

push()
hsl(0.5, 1, 0.3)
scale(2)
ball()
pop()

fx_bloom()


--
-- planet control audio
--
rotateY(pi/2)
rotateZ(pi/3+sin(time()/7)/5)
rotateX(time() / 4)

a = 64

b = time()/16%1

loop i <- a times
  push()
  rotateX(2 * pi * i / (a / (b*4+1)))
  translate(i/a*b*6 - b*2.5, 3, 0)
  hsl(0.05, 1, 0.3)
  scale(0.1+fft(2), 1, 0.7)
  box()
  pop()
endloop

push()
hsl(0.5, 1, 0.3)
scale(fft(1)*fft(0)*4+1)
ball()
pop()


fx_bloom()

--
-- colour spin
--

a = 256
loop i <- a times
  push()
  ii = i/a+time()/4%a
  translate(sin(i)*5*(ii%1), cos(i)*5*(ii%1), 3-ii*10%10)
  hsl((i/3+time()/4)%1, 0.7, 0.3)
  scale((ii%1)*(fft(1)*3+0.1))
  box()
  pop()
endloop

fx_bloom()

--
-- colour spin 2
--

rotateZ(time()/6)
a = 256
loop i <- a times
  push()
  ii = i/a+time()/4%a
  translate(sin(i)*5*(ii%1), cos(i)*5*(ii%1), 3-ii*10%10)
  hsl((i/3+time()/4)%1, 1.5, 0.4*(beat()%2)+0.01)
  scale((ii%1)*(fft(1)*2+0.1))
  box()
  pop()
endloop

fx_feedback()
fx_warp(1, 0.2, 0.01)
fx_grid(1.3)
fx_feedback()

fx_bloom()