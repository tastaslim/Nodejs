# What is File Descriptor #

Operating system manages a table called fileDescriptor table to provider a reference to processes. Whenever, we open a process (Say we open a file), OS creates an entry corresponding to this process in the table and return an integer which is nothing but index in the table referring to the resource. Using this file descriptor, we can use the resource of that process.
- When we close the process: The entry gets deleted from table and that index is freed which can be used for some other process.

- index 0, 1,2 are reserved in file descriptor table to be used for below purposes:

<table>
<thead>
	<tr>
		<th>index</th>
		<th>used for</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>0</td>
		<td>stdin (Input)</td>
	</tr>
	<tr>
		<td>1</td>
		<td>stdout (Output)</td>
	</tr>
	<tr>
		<td>2</td>
		<td>stderr (Standard Error)</td>
	</tr>
</tbody>
</table>

---
```javascript
import { open } from "fs";
open("file_name.txt", "w", (err, fd)=>{
    // this fd is fileDescriptor which is an integer values pointing to the file_name.txt
});
```