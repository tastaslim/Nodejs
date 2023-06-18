import { log } from "console";
import {arch, cpus, networkInterfaces, userInfo, release, platform} from "os";

log("Architecture:", arch(), "\n");
log("CPUs:", cpus(), "\n");
log("Network interfaces:", networkInterfaces(), "\n");
log("Platform:", platform(), "\n");
log("Release number:", release(), "\n");
log("User info:", userInfo(), "\n");


/*
Methods	Explanation:

os.arch() : Returns the operating system CPU architecture
os.cpus() : Returns an array of objects containing information about each logical CPU core
os.networkInterfaces() : Returns an object containing network interfaces that have been assigned a network address
os.platform() : Returns a string identifying the operating system platform
os.release() : Returns a string that identifies the operating system release number
os.userInfo() : Returns information about the current user

*/