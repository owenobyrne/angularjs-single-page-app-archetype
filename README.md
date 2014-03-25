angularjs-single-page-app-archetype
===================================

A maven archetype for an AngularJS Single Page App deployed in tomcat.

I wanted a quick way to bootstrap an AngularJS application that could be compiled as a WAR and dropped into Tomcat. 

Installation Instructions (for Eclipse/Spring Tool Suite (STS))
--------------------------------------------------------------

 - Clone the repo
 - Right-click the project and Run As... > Maven Install 

This installs the Archetype in your Local Catalog. 

 - Create a new Maven Project (File > New... > Maven Project)
 - At the Archetype selection screen choose 
   - Group ID: `com.owenobyrne`
   - Artifact ID: `angularjs-single-page-app-archetype`
 - Alter the Group ID, Artifact ID and version to suit your website. 
   - These aren't critical, but the Artifact ID will be used as the name of the WAR file and then as the context path of the website on the tomcat server.
 - Click Finish to create the project. 

You should be able to Run As... > Run on Server immediately.
