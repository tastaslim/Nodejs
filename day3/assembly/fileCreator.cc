#include <iostream>
#include <fstream>
using namespace std;

int main()
{
    cout << "Menu:\n[1] Create a new file\n[2] Exit\n";

    while (true)
    {
        int option;
        cout << "Please choose an option: ";
        cin >> option;
        if (option == 2)
        {
            cout << "File Close option is chosen";
            return 0;
        }

        fstream file;
        string fileName;

        cout << "Enter fileName: ";
        cin >> fileName;
        file.open(fileName, ios::out);


        if (!file)
        {
            cout << "Error in creating file!!!";
            return 0;
        }
        string fileContent;
        cout << "Enter fileContent: ";
        getline(cin, fileContent, '$');
        file << fileContent;
        cout << "File created successfully.\n";

        // closing the file.
        // The reason you need to call close()
        // at the end of the loop is that trying
        // to open a new file without closing the
        // first file will fail.
        file.close();
    }

    return 0;
}

// g++ fileCreator.cpp -o fileCreator ==> It will create a fileCreator application which You can use to create a file and use it anywhere in any laptop which uses same (Architecture/OS).