===================
3. Evaluating Sinks
===================

`Citizen Engagement Event #3 - August/November, 2016`

Background
==========

One of the most exciting datasets available to us was high resolution (5ft) LIDAR-derived elevation rasters from WisconsinView. We realized that we could use GIS tools to generate the location of all sinks in the county, a sink being a place with no outflow, i.e. a pixel or group of pixels in the elevation data where every adjacent pixel is higher. Generating these sinks with GRASS GIS produced a huge number of points, over 10,000, but very quick inspection showed a huge percentage of these were, while technically `sinks`, definitely `not sinkholes`. So, we decided to try to design a system for people to help us remove the false positives.

Methodology
===========

Data Preparation
----------------

Sink Data
`````````

Our very first step was to generate the sink locations. We used GRASS GIS and QGIS to create this base data, and you can read much more about how we did it in `Generating Sinks from LIDAR <generating-sinks-from-lidar.html>`_. The result of this process was not only points for each sink, but polygons representing the area of the sink. With the generation creating so many sinks, over 10,000, we knew we would have to filter it down to much smaller subsets before we could effectively present it to participants. We combined two approaches to accomplish this (much of this is covered in greater detail in the page linked above).

**1. Spatial Filters**

* We noticed that a large number of sinks were returned along roadside ditches, so we generated a 30ft buffer from TIGER/line road centerlines in the county, and excluded any sinks that fell within that buffer.
* Based on consultation with CSP karst geology specialists, we decided to eliminate any sink points within the National Flood Hazard Layer.

**2. Sink Depth Filters**

As a by-product of the sink generation workflow that we used, we were able to attach the depth of each sink to the centroid points that we were working with. We had already filtered out sinks with a depth of less than one foot during the initial generation process, so we split the remaining sinks into the following "depth categories":

* 1-2 feet (count: 5,611)
* 2-5 feet (count: 1,475)
* 5+ feet (count: 301)

This allowed us to focus our participants efforts on a considerably smaller subset of points than we started with. Also, these particuler filters worked well across the county, so even as we reduced the number of sinks significantly, we did not reduce their geographic coverage.

Basemaps
````````

With a much more manageable number of sink points to deal with, we turned to the other key ingredient, basemaps. Our plan was to have people use a web app interface to perform cursory visual assessments of each sinkhole point against various high-resolution elevation data derivatives, and determine whether the sink did or did not seem to be a sinkhole. To support this, we returned to the original LIDAR data we had used to generate the sinks, and created hillshade and topographic position index layers from it. We used GeoServer to serve these GeoTIFFs into our web app.

Web Map Interfaces
------------------

We ended up doing two different events for this activity. For the first one, we loaded our sinks points into GeoExplorer, and had participants use that interface to view the sink location against our various basemaps. This original interface no longer exists, but after the first event we decided to create our own web app in order to have greater control over its behavior and content, and that web app has evolved into `karstology.crawfordstewardship.org <https://karstology.crawfordstewardship.org>`_. The software architecture of the web app has gone through a few different iterations, which you can read about in the `Web App Architecture <creating-karstology.html>`_ section.

Generally speaking, the web app interface faciliates both the visual comparison of sink points with other datasets as well as the ability to select a sink point and update its attribute(s).

Volunteer Workflows
-------------------

**Event 1**


`Sinkholes Volunteer Guide 1 <_static/files/Sinkholes-Volunteer_Guide-moreimages.pdf>`_

In this initial event, we ultimately asked people to simply determine whether or not the sink point seemed to represent a sinkhole.

**Event 2**

`Sinkholes Volunteer Guide 2 <_static/files/SinkholeVerificationPhase2.pdf>`_

The second time we ran the event, after we had created our own web map application from scratch, we provided a set of categories for the sinks and asked people to chose one when they evaluated the sink.

Results
=======

*coming soon!*