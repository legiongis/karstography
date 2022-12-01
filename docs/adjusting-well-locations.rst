=================================
2. Improving Well Location Points
=================================

`Citizen Engagement Event #2 - Aug. 9th, 2016`

Background
==========

Well location spatial data, in the form of point coordinates, can be freely acquired through the WGNHS. We acquired this spatial data for Crawford County, but upon inspection we realized that very often the point did not represent the location of the well, but the centroid of the section, quarter section, or quarter quarter section in which the well is located. While centroid points can be helpful if you are aggregating data to a more generalized display, they are not useful if you want to compare signs of karstic acitivy in the WCR drill log with nearby geological features.

Thus, we decided to design a volunteer activity that would facilitate the correction of well points using a web map interface.

Methodology
===========

We set up an instance of OpenGeoSuite, a web-GIS platform created by Boundless, and populated it with the well data that we wanted to correct. The interface is no longer operational, but you can read the `full methology handout <_static/files/Methodology for Well Location Improvements.pdf>`_ that we provided to volunteers to get an idea of the process.

.. image:: _static/img/Well Point Location Improvements-annotated.png

One feature of the workflow that is worth pointing out is that we attempted to systematically prioritize points that were lone centroids within a PLSS division. The theory was that in such cases, a single dwelling would be visible in the vicinity, as the image above illustrates.

Results
=======

A small group of volunteers gathered with us at the Crawford County Public Library in Soldiers Grove in the early evening of August 9th, 2016. After introducing the project and going over the workflow, each person began working on a laptop or library computer. Unfortunately, it quickly became clear that the interface was not easy enough for many people to use, and was buggy. The methodology we had planned was not clear enough in many cases, and overall very little was accomplished.

Reflections
===========

Overall, we at Legion GIS felt that we did not prepare well enough for this event. The technical aspects of the web interface did not work as well as we had expected, and more work up front would have made these shortcomings apparent before beginning the event.
