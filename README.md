# Example application to demonstrate issue with Switch in header

I've created this bare bone application to debug an issue
I was running into using a bottom tab bar navigator with a 
header that contains a toggle. 

The tab bar has 3 tabs. When you switch one by one and then
click the toggle, the toggle quickly jumps to its final state
w/o the smooth animation it normally uses (on Android).

The smooth toggle animation is only removed when you've switched
between each tab and then go back to the first one. So to reproduce
you can do:

- Click "screena" tab button
- Click "screenb" tab button
- Click "screenc" tab button
- Click "screena" tab button again
- Toggle the switch; you'll notice that it the once smooth animation
  is gone.

GIF that demonstrates the issue:  

![](https://i.imgur.com/kCipaLb.gif)

Higher res video that demonstrates the issue:  
https://imgur.com/a/j6YaY9W


## How to reproduce

Get the code:

```bash
git clone git@github.com:roxlu/react-native-tabbar-with-switches-issue.git
cd react-native-tabbar-with-switches-issue

```

Get the modules:

```bash
cd lc
yarn install
```

I had to recreate the gradle wrapper (you might not need this)
```bash
cd lc/android
gradle wrapper
```

In terminal 1:

```bash
cd lc
npx react-native start
```

In terminal 2:

```bash
cd lc
npx react-native run-android
```
