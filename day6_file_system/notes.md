The promise APIs use the underlying Node.js threadpool to perform file system operations off the event loop thread. These operations are not synchronized or threadsafe. Care must be taken when performing multiple concurrent modifications on the same file or data corruption may occur.

**Flag**	| **Description**	 | **File gets created if it doesn't exist**  |
-----------------------------------------------------------------
r+	    | This flag opens the file for reading and writing	| ❌  |
-----------------------------------------------------------------
w+	    | This flag opens the file for reading and writing and it also positions the stream 0th index of file | ✅ |
-------------------------------------------------------------------------------------------------------------------
a	    | This flag opens the file for writing and it also positions the stream at the end of the file	| ✅ |
-------------------------------------------------------------------------------------------------------------------
a+	    | This flag opens the file for reading and writing. it also positions the stream at the end of file | ✅ |
-------------------------------------------------------------------------------------------------------------------


You can also open the file by using the fs.openSync method, which returns the file descriptor, 