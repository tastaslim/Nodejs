# Assembly Language (assembly or ASM) #

- An assembly language is a type of low-level programming language that is intended to communicate directly with a computer's hardware. Unlike machine language, which consists of binary and hexadecimal characters, assembly languages are designed to be readable by humans.
- Programs written in assembly languages are compiled by an assembler. Every assembler has its own assembly language, which is designed for one specific computer architecture.

## Why is ASM useful? ##

- Machine language is a series of numbers, which is not easy for humans to read. Using ASM, programmers can write human-readable programs that correspond almost exactly to machine language.
- The disadvantage is that everything the computer does must be described explicitly, in precise detail. The advantage is that the programmer has maximum control over what the computer is doing.

## Why is ASM a "low-level" language? ##

Assembly is called a low-level programming language because there's (nearly) a one-to-one relationship between what it tells the computer to do, and what the computer does. In general, one line of an assembly program contains a maximum of one instruction for the computer.

## How is ASM different from a "high-level" language? ##

High-level languages provide abstractions of low-level operations which allow the programmer to focus more on describing what they want to do, and less on how it should be done. Programming this way is more convenient and makes programs easier to read at the sacrifice of low-level control.

Programs written in high-level languages never match the raw speed and efficiency of programs written in assembly. Examples of high-level languages include Python, Java, JavaScript, Golang etc.

## What is a "mid-level" language? ##

Mid-level languages or lower-level languages provide some high-level abstractions to make the programmer's life easier, while still providing access to low-level operations. They are often used to write operating systems, so they are sometimes called system programming languages.

Programs written in mid-level languages can perform as well, or nearly as well, as programs written in assembly language. Examples of mid-level programming languages include C, C++, Ada, Nim, and Rust.

## Is ASM portable? ##

No. Because assembly languages are tied to one specific computer architecture, they are not portable. A program written in one assembly language would need to be completely rewritten for it to run on another type of machine.

Portability is one of the main advantages of higher-level languages. The C programming language is often called "portable assembly" because C compilers exist for nearly every modern system architecture. A program written in C may require some changes before it will compile on another computer, but the core language is portable.

Generally speaking, the higher-level a language is, the fewer changes need to be made for it to run on another architecture. The lowest-level languages — machine language and assembly language — are not portable.

```text
To create corresponding executable and assembly file using input Use below command.

""" g++ -S -o FileCreator.s FileCreator FileCreator.cpp """

A fileCreator application which You can use to create a file and use it anywhere in any laptop which uses same (Architecture/OS).


```

You see for a simple input creation, how much code we have to write in assembly.