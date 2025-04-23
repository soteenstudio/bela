# Contribution Guidelines
Thank you for your interest in contributing to this project!
Before you start contributing, make sure you have read the guidelines we have provided.

## Steps to contribute
To understand the cross-project contribution flow, please follow the following step-by-step contribution guide:
1. **Fork repository**:  
    If you want to contribute, you must first fork this project. Click the Fork button on the repository page to create a copy of this repository in your GitHub account.

2. **Clone to local**:  
    After forking, you should clone the project to your local computer. So you can start editing.
    ```bash
    git clone https://github.com/username/repository-name.git
    ```
    Change ``username`` and ``repository-name`` to match your GitHub account name and the repository you forked.

3. **Create a new branch**:  
    Before starting changes, create a new branch with a descriptive name. This is important so that your changes do not affect the ``main`` branch.
    ```bash
    git checkout -b branch-name
    ```
    Replace ``branch-name`` with a name that matches the feature or bug you are working on, for example ``fix-bug-training``

4. **Make changes and commit**:  
    After that, make the desired changes to the project. Once done, don't forget to stage and commit your changes with a clear message.
    ```bash
    git add .
    git commit -m "description of the changes you made"
    ```

5. **Push changes to Github**:  
    Push the changes you made to the repository you forked.
    ```bash
    git push origin branch-name
    ```
    Replace ``branch-name`` with the name of the branch you just created.

6. **Create a Pull Request**:  
    Once the push is complete, open GitHub and go to the repository page that you forked. There will be a button to create a Pull Request (PR) from the branch that you created to the repository. Click the button and fill in the PR description with a brief explanation of the changes you are making.

## Code Style and Standards
To maintain consistency across the project, please adhere to the following code style guidelines:
- **Indentation**: Use 2 spaces for indentation.
- **Type safety**: Avoid using ``any`` explicitly. Try to use more specific data types such as ``string``, ``number``, or ``boolean``.
- **Naming Conventions**: Use ``camelCase`` for variables and function names. Use ``PascalCase`` for classes and constructors.
- **Avoid Global Variables**: Always use local variables where possible.