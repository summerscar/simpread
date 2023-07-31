> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [blog.logrocket.com](https://blog.logrocket.com/6-best-package-managers-windows-beyond/)

The first time I turn on a new computer or boot up my PC after reinstalling Windows, I’m faced with the mammoth task of finding and reinstalling all the software that I like. This list is pretty long, so finding and installing everything can take some time.

Other times, I need to install software on a virtual machine, or a computer may require some software as a build-time requirement. In these cases, I can’t install the software by clicking “next” on an install wizard. I have to install the software in a “headless” manner — that is, without a UI to interact with.

While Windows has been fairly slow in the package management space, the same can’t be said of Linux distributions. Commands like `apt-get` can find and install software packages and dependencies, as well as warn you of possible conflicts.

These days, package management has well and truly come to Windows, with quite a few good options to choose from. So what are those options, and what are their pros and cons? Let’s explore them in this article.

Jump ahead:

*   [Winget](#winget)
*   [Chocolatey](#chocolatey)
*   [Scoop](#scoop)
*   [Ninite](#ninite)
*   [Options beyond Windows package managers](#options-beyond-windows-package-managers)
    *   [macOS — Homebrew](#macos-homebrew)
    *   [Cross-platform — npm](#cross-platform-npm)
*   [How should you manage your packages?](#how-should-you-manage-your-packages)

Winget
------

The first package manager worth mentioning is the package manager you have installed right now, which is Winget. It ships with Windows 11 and was added to Windows 10 via an update. You can test it out by typing `winget` at the command line:

![Screenshot Of Windows Command Line Being Used To Test Out Winget](http://blog.logrocket.com/wp-content/uploads/2023/07/img1-Testing-Winget-command-line-Windows-e1690226747390.png)

Installing packages through Winget is about as simple as you can imagine! Simply type the following:

```
winget install packagename
```

Because it’s a standard tool on Windows, running `winget list` shows all packages that have been installed through Winget as well as through the Microsoft Store.

### Using Winget to find packages to install

You can use Winget itself to search for packages. For example, if you want to install the LLVM compiler, you can just type `winget search llvm` and you’ll receive results like the below:

```
C:\>winget search llvm
Name  Id               Version Match     Source
-----------------------------------------------
LLVM  LLVM.LLVM        16.0.4            winget
Spice ChilliBits.Spice 0.16.1  Tag: llvm winget
```

Technically, it’s a response. But it’s pretty light on details. Who authors this package? Where does it come from? Fortunately, you can use the winget.run site to search for packages and their details. In our case, searching for LLVM and clicking the first result yields these results:

![First Search Result For Llvm On Winget Run Site For Package Search And Details](http://blog.logrocket.com/wp-content/uploads/2023/07/img2-First-search-result-Winget-LLVM-e1690226762578.png)

It’s a lot more informative, and a lot more useful. So how does Winget stack up?

*   ✅ Comes with Windows
*   ✅ Easy to use
*   ❌ Doesn’t have a built-in way to view packages — have to use winget.run, which appears to be community-supported and may not be around forever

Chocolatey
----------

Before Winget was around, package management on Windows was still something that people needed. In those times, and to this day, Chocolatey answered that need.

In concept, Chocolatey is largely the same as Winget, as far as finding and installing packages go. However, Chocolatey is a more refined solution, as it began development in 2011.

Because package installers can run PowerShell scripts, pretty much any administrative task relating to package installations can be carried out with Chocolatey.

The package specification is also largely compatible with the much-used Nuget package spec, so developers who want to create their own package can do so without learning too much new technology.

* * *

[![](https://blog.logrocket.com/wp-content/uploads/2023/04/Screen-Shot-2023-04-05-at-3.19.07-PM.png)

Over 200k developers use LogRocket to create better digital experiences
-----------------------------------------------------------------------

![](https://blog.logrocket.com/wp-content/uploads/2022/08/rocket-button-icon.png)](https://lp.logrocket.com/blg/learn-more) 

* * *

@media all and (max-width: 800px){ .tweet-embed-container {flex-direction: column !important;} .single-tweet, .embed-tweet-right {width: 100% !important;} } .embed-link {text-decoration: none;} .embed-link:hover {text-decoration: none;} .tweet-embed-container {border-radius: 20px; background: radial-gradient(79.69% 102.24% at 100% 100.11%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)), radial-gradient(89.7% 115.09% at 3.43% 2.75%, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0)), #764ABC; background-blend-mode: overlay, overlay, normal; box-shadow: 0 4px 0 #d5d5d5; width: auto; padding: 20px 15px; display: flex; flex-direction: row; justify-content: space-evenly; align-items: center; margin: 0 auto; gap: 3%; } .single-tweet {width: 50%;} .single-tweet img {max-width: 100%;height: auto; border-radius:7px;} .embed-tweet-right {width: 46%;} .embed-tweet-right h2 {font-family: 'Avenir'; font-style: normal; font-weight: 500; font-size: 16px; line-height: 28px; color: #FFFFFF;} .embed-btn { display: flex; flex-direction: row; justify-content: left; width: 170px; gap: 5px; align-items: center; padding: 0px 10px; font-family: 'Avenir'; font-style: normal; font-weight: 900; font-size: 16px; line-height: 16px; color: #764ABC; height: 48px; /* White */ background: #FFFFFF; mix-blend-mode: normal; box-shadow: 0px 24px 30px rgba(0, 0, 0, 0.11); border-radius: 80px; border: none; }

Installing Chocolatey is very simple — just copy the command from the installation page and paste it into PowerShell. The most recent version of the command as of this article’s writing is copied below, but be sure to get the most up-to-date version directly from the Chocolatey website:

```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

This command allows the PowerShell installer script to run, before downloading and executing the installer script. After this, you’re good to call the `choco` command. For example, let’s run `choco find llvm`, which yields this output:

```
PS C:> choco find llvm
Chocolatey v2.0.0
2 validations performed. 1 success(es), 1 warning(s), and 0 error(s).

Validation Warnings:
 - A pending system reboot request has been detected, however, this is
   being ignored due to the current command being used 'find'.
   It is recommended that you reboot at your earliest convenience.

ccls 0.20220729.0 [Approved]
dotnetcoresdk 1.0.1 [Approved] Downloads cached for licensed users - Possibly broken for FOSS users (due to original download location changes by vendor)
ghc 9.6.1 [Approved]
ldc 1.32.2 [Approved] Downloads cached for licensed users
llvm 16.0.5 [Approved] Downloads cached for licensed users
winlibs 10.11.8 [Approved] Downloads cached for licensed users
winlibs-llvm-free 10.11.0 [Approved] Downloads cached for licensed users
7 packages found.
```

Again, we see our LLVM compiler available. Interestingly, Winget only reported having v15.0.7 available at the time of writing, whereas Chocolatey has v16.0.5 available. It’s just one package, but in this particular case, it seems that Chocolatey has the more up-to-date package.

Another nice thing about Chocolatey is that the package explorer seems to be first-party to Chocolatey itself, so one could reasonably assume that it will be around for as long as Chocolatey is. It’s quite a bit more detailed than its Winget counterpart, too:

![Chocolatey Package Explorer With Llvm Package Information Displayed](http://blog.logrocket.com/wp-content/uploads/2023/07/img3-Chocolatey-package-explorer.png)

Also, users can post questions and answers on individual packages, which can help when considering how to automate the installation of a given package:

![User Questions And Answers For Llvm Package On Chocolatey Package Explorer](http://blog.logrocket.com/wp-content/uploads/2023/07/img4-User-questions-answers-individual-packages-Chocolatey-package-explorer.png)

The only mild-to-moderate downside of Chocolatey is that installing packages usually requires administrator rights to do so. So, how does Chocolatey compare?

*   ✅ Free, easy-to-use package manager
*   ✅ Has a long history (since 2011) so is definitely reliable by now
*   ✅ Package searching function is first-party to Chocolatey itself
*   ❌ Doesn’t ship with Windows, requires a modicum of effort to install

If you’d like to jump right into using this package manager, check out this tutorial on [using Node on Windows with Chocolatey](https://blog.logrocket.com/install-node-windows-chocolatey/).

Scoop
-----

![Homepage For Scoop Command Line Installer For Windows](http://blog.logrocket.com/wp-content/uploads/2023/07/img5-Scoop-command-line-installer-Windows.png)

Package managers like Chocolatey require administrator privileges to install an app somewhere like Program Files, whereas Scoop takes a more restricted approach to permissions for the apps you install.

Take, for example, installing a tool like VS Code. Normally, if you were installing it yourself, or if you used a tool like Chocolatey, it might install in your program files, your `AppData` profile on your computer, or somewhere similar.

While this usually doesn’t present issues, having things installed in places on your computer that are modifiable by you, the system, and other installers can — at times — cause conflicts.

To understand what makes Scoop different, let’s see the output of installing VS Code via Scoop:

![Terminal Output Of Installing Vs Code Via Scoop](http://blog.logrocket.com/wp-content/uploads/2023/07/img6-Installing-VS-Code-Scoop-output.png)

In this case, we first add the third-party “extras” bucket. Then, we issue the `scoop install vscode` command to begin the installation.

Instead of the installation package for VS Code coming in, a compressed package has been downloaded. Next, it’s extracted to the `scoop` directory within our home drive.

Finally, a “shim” is used that points to this installation instance of VS Code. The benefit of this approach is that you could pretty much delete the entire `scoop` directory, and the rest of your system would be unaffected.

Searching for VS Code on the Scoop webpage returns a list of packages that match what we’re after. Clicking into a specific package’s details gives some basic details regarding its version and when the package was last updated:

![Package Details For Vs Code Package Search Result On Scoop Webpage](http://blog.logrocket.com/wp-content/uploads/2023/07/img7-Search-VS-Code-Scoop-webpage.png)

There’s not a lot else here — no comments on the packages themselves or descriptions of how this package is installed.

Clicking on the version links to a GitHub page that contains a lot of detail about how this package is installed. This is good because you can see precisely what an installation package is doing and that it’s not interacting with other files or folders outside of the main Scoop directory. Neat!

Ninite
------

Up until now in this article, all of the tools that we’ve covered have been heavily focused on using the command prompt to install tools. For most people, this will work just fine, but others prefer a UI tool to view and manage software updates.

In these cases, Ninite is a great option:

![Homepage For Ninite Ui Tool For Viewing And Managing Software Updates](http://blog.logrocket.com/wp-content/uploads/2023/07/img8-Ninite-UI-tool-view-manage-software-updates.png)

There’s a very extensive list of apps available, and all of the installers have been automated. Ninite also claims to only install the minimum, and not install needless cruft like toolbars and the like:

![List Of Available Apps Through Ninite](http://blog.logrocket.com/wp-content/uploads/2023/07/img9-List-available-apps-Ninite.png)

You just tick the apps you want, and then press the “Get Your Ninite” button:

![Get Your Ninite Button With Instructions To Download And Run Automated Custom Installer](http://blog.logrocket.com/wp-content/uploads/2023/07/Get-Your-Ninite-button.png)

A very small 500kb executable is downloaded, which will retrieve and install the most up-to-date versions of the apps available. Easy.

Options beyond Windows package managers
---------------------------------------

In a perfect world, all of the above options would be more than adequate. However, there are quite a few choices when it comes to operating systems, and you may want to manage packages on your computer, which could run Linux or macOS.

Fortunately, these operating systems have been around as long as Windows, and while they see less use, the requirement to easily manage packages exists in their realms also. So what should you use if you are managing a non-Windows machine?

### macOS — Homebrew

If you’re not on Windows, but instead use macOS, [Homebrew offers the best solution here](https://blog.logrocket.com/how-to-set-up-m1-macbook-web-development/):

![Homepage For Homebrew Mac Package Manager With Search Bar And Installation Command](http://blog.logrocket.com/wp-content/uploads/2023/07/img10-Homebrew-macOS-development-e1690227110209.png)

Installation is carried out by a simple command executed in the terminal, like this:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Search functionality is built into the website itself, but the information retrieved on packages can be a little austere:

![Homebrew Search Results And Details For Flutter Sdk](http://blog.logrocket.com/wp-content/uploads/2023/07/img11-Search-functionality-Homebrew-e1690227121263.png)

But still, with a link to the GitHub repository present, it’s easy enough to get the information that you’re after.

### Cross-platform — npm

Many tasks that you wish to undertake could possibly also be provided by a package from the npm repository:

![Npm Cross Platform Package Manager Homepage](http://blog.logrocket.com/wp-content/uploads/2023/07/img12-Cross-platform-package-manager-npm.png)

Access to npm is provided by installing Node.js, then using the following command:

```
npm install -g package-name
```

As an added option, you can also use `npx` to install and subsequently execute the package you are after.

Packages can be searched for on the npm website, and results are very informative. See the following example of this package that lets you find and remove `node_modules` from a directory to save space:

![Search Results For Npkill Package On Npm](http://blog.logrocket.com/wp-content/uploads/2023/07/img13-Search-results-npm-package.png)

How should you manage your packages?
------------------------------------

There are quite a few options, so if you need to make a quick choice, take a glance at the below.

<table class="table-top-header" data-ace-table-col-widths="192;192;192;192"><tbody><tr><th>Name</th><th>Platforms</th><th>Pros</th><th>Cons</th></tr><tr><td>Winget</td><td>Windows</td><td><ul><li>Comes with Windows</li><li>Easy, straightforward package installation</li><li>Fairly detailed information about packages via winget.run</li></ul></td><td><ul><li>Heavy use of console to install packages</li><li>winget.run isn’t first-party (community-supported)</li><li>Installs packages globally</li></ul></td></tr><tr><td>Chocolatey</td><td>Windows</td><td><ul><li>Easy to install</li><li>Very detailed package page, with comments by community users</li><li>Package search is first-party to Chocolatey itself</li></ul></td><td><ul><li>Not included with Windows</li><li>Installs packages globally</li><li>Will make you crave chocolate every time you install a package 🍫</li></ul></td></tr><tr><td>Scoop</td><td>Windows</td><td><ul><li>Easy to install</li><li>Package search is first-party to Scoop itself</li><li>Package installation does not occur globally — packages are installed to the <code class=" prettyprinted" style="">scoop</code> directory</li></ul></td><td><ul><li>Not included with Windows</li><li>Package details on the page are minimal — have to read installation scripts on GitHub to understand what they are doing</li></ul></td></tr><tr><td>Ninite</td><td>Windows</td><td><ul><li>Webpage makes it easy to choose what apps you want installed</li><li>The easiest, most UI-driven package manager</li></ul></td><td><ul><li>Installable apps are limited to those available on the Ninite webpage</li></ul></td></tr><tr><td>Homebrew</td><td>macOS, Linux</td><td><ul><li>Easy to install, has been in use for a very long time on macOS</li><li>Installs apps within a specific brew folder, does not cause system-wide changes</li><li>Has existed for a long time. Very stable on macOS</li></ul></td><td><ul><li>Package description page is light on details</li><li>Heavy use of beer emojis in console during installation may make you want to start day drinking 🍻</li></ul></td></tr><tr><td>npm</td><td>Literally everything</td><td><ul><li>A huge library of Node apps, utilities, and packages</li><li>Easy to install</li></ul></td><td><ul><li>Can be technical at times</li><li>Node dependency can make apps run a little slower</li></ul></td></tr></tbody></table>

No matter what package management solution you use, one thing we can be sure of is that package managers save us from a lot of button-clicking on installers. They also make it a lot easier to configure a build machine or build environment to build a specific app.

Whichever package manager you choose, you’ll no doubt save some time, so enjoy!

![](https://blog.logrocket.com/wp-content/uploads/2019/10/green-check.png)
--------------------------------------------------------------------------

Deploying a Node-based web app or website is the easy part. Making sure your Node instance continues to serve resources to your app is where things get tougher. If you’re interested in ensuring requests to the backend or third party services are successful, [try LogRocket](https://lp.logrocket.com/blg/node-signup). [![LogRocket Network Request Monitoring](https://blog.logrocket.com/wp-content/uploads/2019/12/network-request-filter-2-1.png)](https://lp.logrocket.com/blg/node-signup)[https://logrocket.com/signup/](https://lp.logrocket.com/blg/node-signup)

[LogRocket](https://lp.logrocket.com/blg/node-signup) is like a DVR for web and mobile apps, recording literally everything that happens while a user interacts with your app. Instead of guessing why problems happen, you can aggregate and report on problematic network requests to quickly understand the root cause.

LogRocket instruments your app to record baseline performance timings such as page load time, time to first byte, slow network requests, and also logs Redux, NgRx, and Vuex actions/state. [Start monitoring for free](https://lp.logrocket.com/blg/node-signup).

### Share this:

*   [Twitter](https://blog.logrocket.com/6-best-package-managers-windows-beyond/?share=twitter&nb=1 "Click to share on Twitter")
*   [Reddit](https://blog.logrocket.com/6-best-package-managers-windows-beyond/?share=reddit&nb=1 "Click to share on Reddit")
*   [LinkedIn](https://blog.logrocket.com/6-best-package-managers-windows-beyond/?share=linkedin&nb=1 "Click to share on LinkedIn")
*   [Facebook](https://blog.logrocket.com/6-best-package-managers-windows-beyond/?share=facebook&nb=1 "Click to share on Facebook")